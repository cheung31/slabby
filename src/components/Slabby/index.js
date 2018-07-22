import Slab from './Slab';

const Slabby = (props) => {
    const {
        slabWidth=240,
        slabHeight=240,
        slabBuffer = 10,
    } = props;

    const slabs = Array(slabBuffer)
        .fill(0)
        .map((_, idx) => <Slab key={idx} slabWidth={slabWidth} slabHeight={slabHeight} />);

    return (
        <div>
            {slabs}
        </div>
    );
};

export default Slabby;
