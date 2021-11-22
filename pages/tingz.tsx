import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import {usePhotos} from "../hooks/usePhotos";

const Tingz: NextPage = () => {
    const { photos } = usePhotos()

    return (
        <div className={styles.container}>
            <ul>
                {photos.map((photo) =>
                    <li key={photo.id}>
                        <h3>{photo.title}</h3>
                        <p>{photo.description}</p>
                        <p>{photo.content_date}</p>
                        <p>{photo.external_source}</p>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Tingz
