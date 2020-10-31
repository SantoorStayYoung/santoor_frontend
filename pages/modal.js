import styles from '../styles/Modal.module.scss'
export default function Modal(){
    return (
    <div>
        <div className={styles.modalContainer}>
            <div className={styles.modalBackground}>
                <div className={styles.modal}>
                    <h2>I'm a Modal</h2>
                    <p>Hear me roar.</p>
                    <svg className={styles.modalSvg} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
                        <rect x="0" y="0" fill="none" width="226" height="162" rx="3" ry="3"></rect>
                    </svg>
                </div>
            </div>
        </div>
        <div className={styles.content}>
            <h1>Modal Animations</h1>
            <div className={styles.buttons}>
                <div id="one" className={styles.button}>Unfolding</div>
                <div id="two" className={styles.button}>Revealing</div>
                <div id="three" className={styles.button}>Uncovering</div>
                <div id="four" className={styles.button}>Blow Up</div>
                <div id="five" className={styles.button}>Meep Meep</div>
                <div id="six" className={styles.button}>Sketch</div>
                <div id="seven" className={styles.button}>Bond</div>
            </div>
        </div>
    </div>
    )
}