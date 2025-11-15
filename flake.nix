{
  description = "schemascii dev env";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    # TODO: Enable use on multiple architectures
    # Inspiration: https://github.com/nvim-neorg/neorg/blob/main/flake.nix
    system = "x86_64-linux";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs {
        inherit system;
      };
    in
      pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
        ];

        shellHook = ''
          echo "node `node --version`"
        '';
      };
  };
}
