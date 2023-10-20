image="oxheadalpha/flextesa:20230607"
alice=`docker run --rm $image flextesa key alice`
bob=`docker run --rm $image flextesa key bob`
charlie=`docker run --rm $image flextesa key charlie`
donald=`docker run --rm $image flextesa key donald`


docker run \
        --name flextesa_sandbox \
        -p 20000:20000 \
        --rm \
        --detach \
        $image \
        flextesa mini-net \
          --root /tmp/mini-box --size 4 \
          --set-history-mode N000:archive \
          --number-of-b 4 \
          --balance-of-bootstrap-accounts tez:100_000_000 \
          --time-b 1 \
          --add-bootstrap-account="${alice}@2_000_000_000_000" \
          --add-bootstrap-account="${bob}@2_000_000_000_000" \
          --add-bootstrap-account="${charlie}@2_000_000_000_000" \
          --add-bootstrap-account="${donald}@2_000_000_000_000" \
          --no-daemons-for=donald \
          --until-level 200_000_000 \
          --protocol-kind Nairobi