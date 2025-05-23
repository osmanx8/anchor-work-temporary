import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorMovieRevoewPg523 } from "../target/types/AnchorMovieRevoewPg523";
import { expect } from "chai";

describe("anchor-movie-revoew-pg-5-23", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env(); /////
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorMovieRevoewPg523 as Program<AnchorMovieRevoewPg523>;
  const movie = {
    title: "Just a test movie",
    description: "Wow what a good movie it was real great",
    rating: 5,
  };

  ///////////
  const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
    program.programId
  );

  it("Movie review is added", async () => {
    ///////////why no pubkey
    const tx = await program.methods
      .addMovieReview(movie.title, movie.description, movie.rating)
      .accounts({})
      .rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);
    expect(movie.title === account.title);
    expect(movie.rating === account.rating);
    expect(movie.description === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });

  it("Movie review is updated`", async () => {
    const newDescription = "Wow this is new";
    const newRating = 4;
    /////////////////////
    const tx = await program.methods
      .updateMovieReview(movie.title, newDescription, newRating)
      .accounts({})
      .rpc();

    const account = await program.account.movieAccountState.fetch(moviePda);
    expect(movie.title === account.title);
    expect(newRating === account.rating);
    expect(newDescription === account.description);
    expect(account.reviewer === provider.wallet.publicKey);
  });
});
