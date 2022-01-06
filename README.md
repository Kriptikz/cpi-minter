# cpi-minter

This is a simple example project for minting some tokens in Rust using a Solana Cross-Program Invocation. The mint account creation is done in typescript. The mints token account for the user is also created in typescript. We simply call the anchor_spl::token::mint_to program function from our program using a CPI. This is mostly a 
typescript project.

For an example of mint account creation and token account creation as well as minting, refer to my other example project:
https://github.com/Kriptikz/program-token-minting
