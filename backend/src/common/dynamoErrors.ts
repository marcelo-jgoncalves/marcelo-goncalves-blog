// A conditional write's failure surfaces differently depending on whether it
// ran as a plain PutCommand/UpdateCommand (ConditionalCheckFailedException)
// or inside a TransactWriteCommand (TransactionCanceledException, with the
// real reason nested in CancellationReasons) — callers need one check that
// covers both shapes without caring which path a given write took.
export function isConditionalCheckFailure(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "ConditionalCheckFailedException") return true;
  if (error.name === "TransactionCanceledException") {
    const reasons = (error as { CancellationReasons?: Array<{ Code?: string }> }).CancellationReasons;
    return Boolean(reasons?.some((reason) => reason.Code === "ConditionalCheckFailed"));
  }
  return false;
}
