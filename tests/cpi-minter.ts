import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { CpiMinter } from '../target/types/cpi_minter';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { assert } from "chai";

describe('cpi-minter', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.CpiMinter as Program<CpiMinter>;

  let mintA = null;
  let initializerTokenAccountA = null;

  const airdropAmount = 10000000000;
  const initializerAmount = 100;

  const mintAuthority = anchor.web3.Keypair.generate();
  const payer = anchor.web3.Keypair.generate();
  const initializerMainAccount = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });

  it('Airdrop SOL to payer using ts!', async () => {
    console.log("Airdropping SOL");

    // Airdrop tokens to a payer
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, airdropAmount),
      "confirmed"
    );

    // Get the new balance
    let balance = await provider.connection.getBalance(payer.publicKey);

    console.log("Balance: ", balance);

    assert.ok(airdropAmount == balance);
  });

  it('Mints a new token using ts!', async() => {
    // Airdrop tokens to a payer
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(payer.publicKey, airdropAmount),
      "confirmed"
    );

    // Create our mint
    mintA = await Token.createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      0,
      TOKEN_PROGRAM_ID
    );

    // Create our mint account for the initializer
    initializerTokenAccountA = await mintA.createAccount(initializerMainAccount.publicKey);

    // Mint our tokens to our initilizerTokenAccountA
    await mintA.mintTo(
      initializerTokenAccountA,
      mintAuthority.publicKey,
      [mintAuthority],
      initializerAmount
    );

    // Get our intitializerTokenAccountA info
    let _initializerTokenAccountA = await mintA.getAccountInfo(initializerTokenAccountA);
    
    // Get the amount of tokens in initializerTokenAccountA
    let amount = _initializerTokenAccountA.amount.toNumber();

    console.log("TokenAccountA balance: ", amount);

    assert.ok(initializerAmount, amount);
  });
});
