import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { LoadingSpinner } from "../../styles/shared/LoadingSpinner"
import { useSummary } from "../../context/SummaryProvider"
import { SummaryContainer } from "./Calendar.Styles"
import { Column, Row } from "../../styles/shared/BaseLayout"
import { SecondaryButton } from "../../styles/shared/Button.styles"
import { FaTimes } from "react-icons/fa"

export const Snapshot = () => {
    const { summary, isSummaryLoading, setIsSummaryVisible } = useSummary();       

    return (
        <>
            <Row main="spaceBetween" cross="start" gap="sm">
                <h1>Snapshot</h1>
                <SecondaryButton onClick={() => setIsSummaryVisible(false)} title="Close">
                    <FaTimes size={14} />
                </SecondaryButton>
            </Row>
            <SummaryContainer>
                {isSummaryLoading ? <LoadingSpinner /> : (
                    <div style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                <ReactMarkdown components={{
                    p: ({node, ...props}) => (
                        <p style={{ fontSize: "0.8rem", margin: "0.25rem 0" }} {...props} />
                    )
                }}> 
                  {summary}
                </ReactMarkdown>
              </div>
          )}
        </SummaryContainer>
        </>
    );
}
