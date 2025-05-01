import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { LoadingSpinner } from "../../../styles/shared/LoadingSpinner"
import { useSummary } from "../../../context/SummaryProvider"
import { SummaryContainer } from "./Calendar.Styles"
import { Column, Row, Spacer } from "../../../styles/shared/BaseLayout"
import { IconButton, SecondaryButton } from "../../../styles/shared/Button.styles"
import { FaTimes } from "react-icons/fa"
import { useActions } from "../../../context/ActionsContext"

export const Snapshot = () => {
    const { summary, isSummaryLoading, setIsSummaryVisible } = useSummary();  
    const { setIsSidebarVisible } = useActions();     

    return (
        <>
            <Row main="spaceBetween" cross="start">
                <h2>Snapshot</h2>
                <IconButton onClick={() => setIsSidebarVisible(false)}>
                <FaTimes size={14}/>
                </IconButton>
            </Row>
            <Spacer height='sm' />
            <SummaryContainer>
                {isSummaryLoading ? <LoadingSpinner /> : (
                    <div style={{ fontSize: "0.7rem", lineHeight: "1.4" }}>
                <ReactMarkdown components={{
                    p: ({node, ...props}) => (
                        <p style={{ fontSize: "0.75rem", margin: "0.25rem 0" }} {...props} />
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
