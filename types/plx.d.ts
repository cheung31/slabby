interface PropertiesItemType {
    startValue: string | number;
    endValue: string | number;
    property: string;
    unit?: string;
}

interface ParallaxDataType {
    start: string | number | SafeHTMLElement;
    startOffset?: string | number;
    duration?: string | number | SafeHTMLElement;
    end?: string | number | SafeHTMLElement;
    endOffset?: string | number;
    properties: PropertiesItemType[];
    easing?: string | array | func;
    name?: string;
}

interface IPlxPros {
    animateWhenNotInViewport?: boolean
    children?: any;
    className?: string;
    disabled?: boolean;
    freeze?: boolean;
    parallaxData: ParallaxDataType[];
    style?: string | number | object;
    tagName?: string;
    onPlxStart?: PropTypes.func;
    onPlxEnd?: PropTypes.func;
}

declare module 'react-plx' {
    declare class Plx extends React.Component<IPlxPros> {
        constructor(props: IPlxPros)
    }
    export = Plx;
}