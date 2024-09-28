import {Component, createSignal, JSX, Show} from 'solid-js';
import catpic from "./cat1.png"


type Color = { r: number, g: number, b: number }
type Box = { color: Color, parts: [[Box, Box], [Box, Box]] | null }


const Box: Component<{ box: Box, x: number, y: number, size: number,fullSize :number }> = (props) => {
    const [isBroken, setIsBroken] = createSignal<boolean>(false)
    const half = props.size / 2
const tile = 10

    const style: JSX.CSSProperties = {
        position: "absolute",
        height: tile*props.size+ "px",
        width: tile*props.size + "px",
        // border:"solid white 1px",
        top: tile*(props.y ) + "px",
        left: tile*(props.x ) + "px",
        "background-color": `rgba(${props.box.color.r},${props.box.color.g},${props.box.color.b})`,
        // "border-radius": 100-(props.fullSize/props.size)+"%"
    }

    if (!props.box.parts) {
        return <div style={style}/>
    } else {


        return (
            <Show when={isBroken()} fallback={<div onmousemove={() => setIsBroken(true)} style={style}/>}>
                <Box fullSize={props.fullSize} box={props.box.parts[0][0]} x={props.x} y={props.y} size={half}/>
                <Box fullSize={props.fullSize} box={props.box.parts[0][1]} x={props.x} y={props.y + half} size={half}/>
                <Box fullSize={props.fullSize} box={props.box.parts[1][0]} x={props.x + half} y={props.y} size={half}/>
                <Box fullSize={props.fullSize} box={props.box.parts[1][1]} x={props.x + half} y={props.y + half} size={half}/>
            </Show>
        )

    }

}

export const App: Component = () => {

    const [isLoading, setIsLoading] = createSignal<boolean>(true)
    const [box, setBox] = createSignal<Box>({color: {r: 0, g: 0, b: 0}, parts: null})


    const image = new Image();
    image.src = catpic;
    image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);

        const img = context.getImageData(0, 0, canvas.width, canvas.height);

        const getPixel = (x: number, y: number): Color => ({
            r: img.data[img.width * 4 * x + y * 4],
            g: img.data[img.width * 4 * x + y * 4 + 1],
            b: img.data[img.width * 4 * x + y * 4 + 2]
        })

        const getBox = (x: number, y: number, size: number): Box => {

            if (size == 1) {
                return {color: getPixel(x, y), parts: null}
            }
            const half = size / 2

            const parts: [[Box, Box], [Box, Box]] = [
                [getBox(x, y, half), getBox(x + size, y, half)],
                [getBox(x, y + size, half), getBox(x + size, y + size, half)]
            ]

const color :Color = {
                r: (parts[0][0].color.r+parts[0][1].color.r+parts[1][0].color.r+parts[1][1].color.r)/4,
                g: (parts[0][0].color.g+parts[0][1].color.g+parts[1][0].color.g+parts[1][1].color.g)/4,
                b: (parts[0][0].color.b+parts[0][1].color.b+parts[1][0].color.b+parts[1][1].color.b)/4
}


            return {color,parts}
        }


        const box = getBox(0,0,32)

        setBox(box)

        /*setBox({
            color: {r: 255, g: 255, b: 255},
            parts: [
                [
                    {color: {r: 255, g: 0, b: 0}, parts: null},
                    {color: {r: 0, g: 255, b: 0}, parts: null}
                ],
                [
                    {color: {r: 0, g: 0, b: 255}, parts: null},
                    {color: {r: 80, g: 80, b: 80}, parts: null}
                ]
            ]
        })*/

        setIsLoading(false)
    };


    return (
        <Show when={!isLoading()} fallback={<>loading</>}>
            test
            <Box box={box()} size={64} x={0} y={0} fullSize={64}/>
            test2
        </Show>
    );
};