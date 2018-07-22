import React from 'react';
import { Gestures } from 'rxjs-gestures';
import { compose, lifecycle } from 'recompose';
import mapPropsStream from 'recompose/mapPropsStream';
import createEventHandler from 'recompose/createEventHandler';
import setObservableConfig from "recompose/setObservableConfig";
import rxjsObservableConfig from "recompose/rxjsObservableConfig";
setObservableConfig(rxjsObservableConfig);

import Slab from './Slab';

function reflectCoordinate(value, bounds) {
    const multiple = Math.round(value / bounds);
    const direction = multiple % 2 === 0 ? 1 : -1;
    return (value - (bounds * multiple)) * direction;
}

function throwWithMomentumGesture(starts) {
    return Gestures
        .pan(starts)
        .repeat()
        .mergeMap((panGesture) => panGesture
            .decelerate(10)
            .takeUntil(starts))
        .map(({
                  targetX, targetY,
                  targetTop, targetLeft,
                  parentTop, parentLeft,
                  targetRight, targetBottom,
                  parentRight, parentBottom
              }) => ({
            targetX: reflectCoordinate(targetX, (parentRight - parentLeft) -
                (targetRight - targetLeft)) + 'px',
            targetY: reflectCoordinate(targetY, (parentBottom - parentTop) -
                (targetBottom - targetTop)) + 'px'
        }))
        .startWith({});
}

const ThrowWithMomentum = mapPropsStream((props) => {
    const { handler: onStart, stream: starts } = createEventHandler();
    const points = throwWithMomentumGesture(starts);
    return props.combineLatest(points, (props, { speed, targetX, targetY }) => ({
        onStart, ...props, speed, targetX, targetY
    }));
});

const spec = {
    componentDidMount() {
        console.log('CLIENT SIDE');
        setObservableConfig(rxjsObservableConfig);
    }
};

const Slabby = (props) => {
    const {
        slabWidth = 240,
        slabHeight = 240,
        slabBuffer = 10,
    } = props;

    const slabs = Array(slabBuffer)
        .fill(0)
        .map((_, idx) => <Slab key={idx} slabWidth={slabWidth} slabHeight={slabHeight}/>);

    return (
        <div
            onMouseDown={props.onStart}
            onTouchStart={props.onStart}
            style={{
                transform: `translate3d(${props.targetX}, ${props.targetY}, 0px)`
            }}>
            >
            {slabs}
        </div>
    );
};



export default compose(
    ThrowWithMomentum,
    lifecycle(spec),
)(Slabby);
