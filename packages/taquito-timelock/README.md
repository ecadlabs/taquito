:::info
This feature is a work in progress, and might be refined in the near future. We encourage Taquito users to try this feature and reach out to us if you have any issues or concerns.
:::

# Timelock

Timelock is a cryptographic primitive that can be used as a part of a commit & reveal scheme, it provides a guarantee that the information associated to the commit phase is eventually revealed.

## Commit & Reveal
A classic commit & reveal scheme consists of these 2 stepsL
- Before the deadline, each participant makes a decision and publishes a commitment, which is proof that they have made a decision that they are unable to change. The proof is the hash of the data they have decided on.
- After the deadline, each participant reveals the data corresponding to their commitment. Other participants will be able to check that the hash of this data is indeed the same as the previous commitment

This scheme makes it possible to prove a certain decision was made before the information is revealed. This information might be the decision of other participants, or some external independent information.

above excerpt, taken from [here](https://docs.tezos.com/smart-contracts/data-types/crypto-data-types#classical-commit--reveal-scheme)

## Taquito Implementation

### Creating a chest
```
import { Chest } from '@taquito/timelock'

const time = 10000;
const payload = new TextEncoder().encode('message');
const { chest, key } = Chest.newChestAndKey(payload, time);

const chestBytes = chest.encode();
const keyBytes = key.encode();
```

### Create a chest from an existing Timelock
```
import { Chest, Timelock } from '@taquito/timelock';

// ...
const time = 10000;
const precomputedTimelock = Timelock.precompute(time); // can be cached
const  { chest, key } = Chest.fromTimelock(payload, time, precomputedTimelock);

const chestBytes = chest.encode();
const keyBytes = key.encode();
```

### Opening a chest
```
import { Chest, ChestKey} from '@taquito/timelock';

//...
const time = 10000;
const [chest] = Chest.fromArray(chestBytes);
const [chestKey] = ChestKey.fromArray(chestKeyBytes);
const data = chest.open(chestKey, time);

```

**Important Notes**:
- `time` param being passed should not be mistaken with the 'time' it takes for a chest to open in Timelocks. The `time` param here relates to a complexity relating to the number of power by modulo operations required to compute the key. Without getting too much into the weeds, we recommend using a value of `10000` and adjust accordingly.
- `payload` relates to the message payload you would like to lock in a chest


## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
