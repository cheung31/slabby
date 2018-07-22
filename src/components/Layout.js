const Layout = (props) => {
    const year = new Date().getFullYear();
    return (
        <div>
            <div className="slabby">
                { props.children }
            </div>
            <div className="vignette vignette-left" />
            <div className="vignette vignette-right" />
            <footer>
                &copy; {year}, Ryan Cheung.
            </footer>
            <style jsx>{`
            .slabby{
   /*border: 1px solid black;*/
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    clear: both;
    margin-top:-125.5px;
    margin-left:-282px;
    width: 99999px;}

    .vignette {
    pointer-events: none;
    opacity: 0.2;
    height: 100%;
    width: 253px;
    display: block;
    position: absolute;
    z-index: 20; }

    .vignette-left {
    left: 0;
    background: url('/static/images/vignette.png') repeat-y left center; }

    .vignette-right {
    right: 0;
    background: url('/static/images/vignette.png') repeat-y right center; }

            footer {
    font-size: 12px;
    display: block;
    position: absolute;
    clear: both;
    bottom: 30px;
    right: 30px; }
    `}</style>
            <style jsx global>{`
html,body,div,span,applet,object,iframe,
h1,h2,h3,h4,h5,h6,p,blockquote,pre,
a,abbr,acronym,address,big,cite,code,
del,dfn,em,img,ins,kbd,q,s,samp,
small,strike,strong,sub,sup,tt,var,
b,u,i,center,
dl,dt,dd,ol,ul,li,
fieldset,form,label,legend,
table,caption,tbody,tfoot,thead,tr,th,td,
article,aside,canvas,details,figcaption,figure,
footer,header,hgroup,menu,nav,section,summary,
time,mark,audio,video{
   margin:0;
   padding:0;
   border:0;
   outline:0;
   vertical-align:baseline;
}
/* HTML5 display-role reset for older browsers */
article,aside,details,figcaption,figure,
footer,header,hgroup,menu,nav,section{
   display:block;
}
body{
   line-height:1;
   font-family: Helvetica;
}
ol,ul{
   list-style:none;
}
blockquote,q{
   quotes:none;
}
blockquote:before,blockquote:after,
q:before,q:after{
   content:'';
   content:none;
}
/* remember to define visible focus styles!
:focus{
   outline:?????;
} */

/* remember to highlight inserts somehow! */
ins{
   text-decoration:none;
}
del{
   text-decoration:line-through;
}

table{
   border-collapse:collapse;
   border-spacing:0;
}
            `}</style>
        </div>
    );
};

export default Layout;