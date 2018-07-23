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
                parentRight, parentBottom,
                speed,
                type,
            } = point;
            console.log('~~', point);
            return {
                type,
                speed,
                targetX,
                targetY,
            };
        })
        .startWith({});
}

const ThrowWithMomentum = mapPropsStream((props) => {
    const eventHandler = createEventHandler();
    const { handler: onStart, stream: starts } = eventHandler;
    const points = throwWithMomentumGesture(starts);
    return props.combineLatest(points, (props, { type, speed, targetX, targetY }) => {
        if (!type && speed <= 0.05) {
            targetX = Math.round(targetX / 252) * 252;
        }
        return {
            onStart,
            ...props,
            speed,
            targetX: targetX + 'px',
            targetY: targetY + 'px',
        };
    });
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

        setTimeout(() => this.props.setOpacity(1), 1);
    },

    componentWillUnmount() {
        this.props.setOpacity(0);

        window.removeEventListener('resize', onResize);
    }
};

const Slabby = (props) => {
    const {
        slabWidth,
        slabHeight,
        slabBuffer,
        index,
    } = props;

    const slabs = slabBuffer
        ? Array(slabBuffer)
            .fill(0)
            .map((_, idx) =>
                <Slab
                    key={idx}
                    focused={idx === index}
                />
            )
        : [];

    return (
        <div
            onMouseDown={props.onStart}
            onTouchStart={props.onStart}
            style={{
                display: 'flex',
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
    withState('index', 'setIndex', 0),
    withState('opacity', 'setOpacity', 0),
    withState('slabBuffer', 'setSlabBuffer', 0),
    lifecycle(spec),
)(Slabby);
