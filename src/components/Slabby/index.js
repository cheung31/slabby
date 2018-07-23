import React from 'react';
import { Gestures } from 'rxjs-gestures';
import { compose, lifecycle, withState } from 'recompose';
import mapPropsStream from 'recompose/mapPropsStream';
import createEventHandler from 'recompose/createEventHandler';
import setObservableConfig from "recompose/setObservableConfig";
import rxjsObservableConfig from "recompose/rxjsObservableConfig";
setObservableConfig(rxjsObservableConfig);

import Slab from './Slab';

function reflectCoordinate(value, bounds) {
    const multiple = Math.round(value / bounds);
    const direction = multiple % 2 === 0 ? 1 : -1;
    console.log('##', (value - (bounds * multiple)) * direction);
    return (value - (bounds * multiple)) * direction;
}

function throwWithMomentumGesture(starts) {
    return Gestures
        .pan(starts)
        .repeat()
        .mergeMap((panGesture) => panGesture
            .decelerate(10)
            .takeUntil(starts))
        .map((point) => {
            const {
                targetX, targetY,
                targetTop, targetLeft,
                parentTop, parentLeft,
                targetRight, targetBottom,
                parentRight, parentBottom
            } = point;
            console.log('~~', point);
            return {
                targetX: targetX + 'px',
                targetY: targetY + 'px'
            };
        })
        .startWith({});
}

const ThrowWithMomentum = mapPropsStream((props) => {
    const { handler: onStart, stream: starts } = createEventHandler();
    const points = throwWithMomentumGesture(starts);
    return props.combineLatest(points, (props, { speed, targetX, targetY }) => ({
        onStart, ...props, speed, targetX, targetY
    }));
});

const resizeHandler = (props) => {
    return () => {
        const {
            setSlabBuffer,
            slabWidth,
        } = props;
        const bufferSize = Math.ceil(window.innerWidth / slabWidth) + 2;
        setSlabBuffer(bufferSize);
    };
};
let onResize;

const spec = {
    componentDidMount() {
        setObservableConfig(rxjsObservableConfig);

        // 1. Center Slabby
        // 2. Set buffer size
        onResize = resizeHandler(this.props);
        onResize();
        window.addEventListener('resize', onResize);

        this.props.setOpacity(1);
    },

    componentWillUnmount() {
        window.removeEventListener('resize', onResize);
    }
};

const Slabby = (props) => {
    const {
        slabWidth,
        slabHeight,
        slabBuffer,
    } = props;

    const slabs = slabBuffer
        ? Array(slabBuffer)
            .fill(0)
            .map((_, idx) => <Slab key={idx} slabWidth={slabWidth} slabHeight={slabHeight} />)
        : [];

    return (
        <div
            onMouseDown={props.onStart}
            onTouchStart={props.onStart}
            style={{
                transition: 'opacity 1s ease-in',
                opacity: props.opacity,
                transform: `translate3d(${props.targetX}, 0px, 0px)`
            }}
        >
            {slabs}
        </div>
    );
};

export default compose(
    ThrowWithMomentum,
    withState('opacity', 'setOpacity', 0),
    withState('slabBuffer', 'setSlabBuffer', 0),
    lifecycle(spec),
)(Slabby);
