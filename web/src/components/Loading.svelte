<div class="root">
	<div class="animRoot"></div>
	<div class="animRoot lower"></div>
</div>

<style>
	.root {
		position: absolute;
		z-index: 999999;

		left: 50%;
		top: 50%;
		-webkit-transform: translate(-25px, -25px);
		transform: translate(-25px, -25px);
	}

	.animRoot {
		width: 10px;
		height: 10px;
		position: absolute;
		top: -5px;
		left: -5px;
		background-color: #fff;
		-webkit-animation: cube-anim 1.6s 0s infinite ease-in-out;
		animation: cube-anim 1.6s 0s infinite ease-in-out;
	}

	.lower {
		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
	}

	@keyframes cube-anim {
		25% {
			-webkit-transform: translateX(50px) scale(0.5) rotate(-90deg);
			transform: translateX(50px) scale(0.5) rotate(-90deg);
		}

		50% {
			-webkit-transform: translate(50px, 50px) rotate(-180deg);
			transform: translate(50px, 50px) rotate(-180deg);
		}

		75% {
			-webkit-transform: translateY(50px) scale(0.5) rotate(-270deg);
			transform: translateY(50px) scale(0.5) rotate(-270deg);
		}

		100% {
			-webkit-transform: rotate(-360deg);
			transform: rotate(-360deg);
		}
	}
</style>
