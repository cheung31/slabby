const Slab = (props) => {
    return (
        <div className="slab"
             style={{ width: props.slabWidth, height: props.slabHeight, backgroundColor: 'red' }}
        >
            <style jsx>{`
            .slab{
   /*border: 1px solid blue;*/
    display: block;
    float: left;
    width: 252px;
    height: 252px;
    margin: 0 10px; }

.slab.centered{
    margin: 0 145px 0 160px; }

.slab.focused{
    margin-left: -180px;
    margin-top: -211px;
    width: 612px;
    height: 612px;
    z-index: 10; }

.slab p{
    color: #AAA;
    height: 100%;
    text-align: center;
    line-height: 250px;
    font-size: 70px; }

.slab.centered p {
    color: #222; }
            `}</style>
        </div>
    );
};

export default Slab;