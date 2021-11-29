import React, {ReactNode} from "react"
import styles from "../styles/labelTag.module.css"

type LabelTagContentProps = {
    vertical?: "top" | "bottom";
    horizontal?: "left" | "right";
    className?: string;
    children: ReactNode;
}
export class LabelTag extends React.Component<LabelTagContentProps> {
    render() {
        const {
            vertical = "top",
            horizontal = "left",
            className,
            children
        } = this.props;

        const vert = vertical[0].toUpperCase() + vertical.slice(1);
        const hor = horizontal[0].toUpperCase() + horizontal.slice(1);

        return (
            <div className={`${styles[`labelTag${vert}${hor}`]} ${className} absolute`}>
                {children}
            </div>
        )
    }
}
