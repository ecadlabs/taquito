#include "contract.mligo"

let defaultStorage : storage = {
    simple= 42;
    complex= (42n, "42");
    optional= (Int 42, String "Answer");
    last_checked_sig= None;
}
