<script lang="ts">
  export let dir: "normal" | "reverse";
</script>

<style lang="scss">
  $animation-duration: 240s;

  img {
    position: absolute;
    top: 50%;
    left: 40%;
    z-index: 0;
    width: 250px;

    &.normal {
      animation: circle-normal $animation-duration linear infinite;
    }

    &.reverse {
      animation: circle-reverse $animation-duration linear infinite;
    }
  }

  @keyframes circle-normal {
    0% {
      transform: rotate(0deg) translate(-400px) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translate(-400px) rotate(-360deg);
    }
  }

  @keyframes circle-reverse {
    0% {
      transform: rotate(0deg) translate(400px) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translate(400px) rotate(-360deg);
    }
  }
</style>

<img
  src="taquito-logo.png"
  alt="taquito-logo"
  class:normal={dir === "normal"}
  class:reverse={dir === "reverse"}
/>
