import Document, {
    Html,
    Head,
    Main,
    NextScript,
    DocumentContext,
} from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head />
                <body
                    className="bg-gray-300 dark:bg-gray-800"
                    style={{ width: '100vw', minHeight: '100vh' }}
                >
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
