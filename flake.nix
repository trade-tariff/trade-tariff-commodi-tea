{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { system = system; config.allowUnfree = true; };
        clean = pkgs.writeScriptBin "clean" ''cd terraform && rm -rf .terraform && rm -rf .terraform.lock.hcl'';
        init = pkgs.writeScriptBin "init" ''cd terraform && terraform init -backend=false'';
        lint = pkgs.writeScriptBin "lint" ''pre-commit run --all-files --show-diff-on-failure'';
        update-providers = pkgs.writeScriptBin "update-providers" ''clean && init && lint'';
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
