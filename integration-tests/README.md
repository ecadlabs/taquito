[![pkgsign status](https://us-central1-pkgsign.cloudfunctions.net/pkgsign-badge?name=@taquito/taquito&expectedIdentity=%40simrob)](https://github.com/RedpointGames/pkgsign)

# Taquito Integration Tests

The `integration-tests` directory contains a testing suite for various contract interactions that require querying a live chain to test properly.

## How to test

If you feel obliged, you can run the entire test suite with `npm run test` inside the `integration-tests` directory. Do know that this can take a bit of time to fully run. 

If you'd like to take a more targeted approach you can use the command: `npm run test -- -t "Title of test here"` So if I have a test block that starts with `it('does some stuff)` then the command `npm run test -- -t "does some stuff"` will run this test only and save you loads of time.


## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
