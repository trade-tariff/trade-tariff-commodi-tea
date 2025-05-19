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
        update-providers = pkgs.writeScriptBin "update-providers" ''cd terraform && terraform init -backend=false -reconfigure -upgrade'';
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_latest
            pkgs.pre-commit
            pkgs.yarn
            init
            clean
            update-providers
          ];
        };
      });
}
