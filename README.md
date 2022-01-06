# cpi-minter

This is a simple example project for minting some tokens in Rust using a Solana Cross-Program Invocation. The mint account creation as well as the mints token account
for the user are created in typescript. We simply call the anchor_spl::token::mint_to program function from our program using a CPI. This is mostly a 
typescript project.
