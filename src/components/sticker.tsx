import { useRef, useEffect, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web";

interface StickerProps {
	json: JSON;
	loop?: boolean;
	speed?: number;
	autoplay?: boolean;
	playOnClick?: boolean;
	className?: string;
}

const StickerDefaultProps: Partial<StickerProps> = {
	loop: true,
	speed: 1,
	autoplay: true,
	playOnClick: true,
};

export function StickerDiv(
	props: StickerProps = StickerDefaultProps as StickerProps,
) {
	const lottieContainerRef = useRef<HTMLDivElement>(null);
	const [lottieItem, setLottieItem] = useState<AnimationItem | null>(null);

	useEffect(() => {
		if (!lottieContainerRef.current || !props.json) return;

		const animation = lottie.loadAnimation({
			container: lottieContainerRef.current,
			renderer: "svg",
			loop: props.loop,
			autoplay: props.autoplay,
			animationData: props.json,
		});

		setLottieItem(animation);

		return () => {
			animation.destroy();
		};
	}, [props.json, props.loop, props.autoplay]);

	useEffect(() => {
		if (!lottieItem) return;
		lottieItem.setLoop(!!props.loop);
	}, [lottieItem, props.loop]);

	useEffect(() => {
		if (!lottieItem) return;
		lottieItem.setSpeed(props.speed || 1);
	}, [lottieItem, props.speed]);

	const play = () => {
		if (lottieItem) {
			lottieItem.resetSegments(true);
			lottieItem.play();
		}
	};

	const onClick = () => {
		if (props.playOnClick) {
			play();
		}
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			onClick();
		}
	};

	return (
		<div
			ref={lottieContainerRef}
			onClick={onClick}
			onKeyDown={onKeyDown}
			onTouchStart={onClick}
			role="button"
			tabIndex={0}
			className={props.className}
		/>
	);
}
