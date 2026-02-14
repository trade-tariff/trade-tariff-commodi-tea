{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { system = system; config.allowUnfree = true; };
        clean = pkgs.writeShellScriptBin "clean" ''cd terraform && rm -rf .terraform && rm -rf .terraform.lock.hcl'';
        init = pkgs.writeShellScriptBin "init" ''cd terraform && terraform init -backend=false'';
        lint = pkgs.writeShellScriptBin "lint" ''pre-commit run --all-files --show-diff-on-failure'';
        update-providers = pkgs.writeShellScriptBin "update-providers" ''clean && init && lint'';
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_latest
            pkgs.pre-commit
            pkgs.yarn
            clean
            init
            lint
            update-providers
          ];
        };
      });
}
