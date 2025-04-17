import { useState } from "react";
import { Row, List } from "../../../styles/shared/BaseLayout";
import { ItemCard } from "../../../styles/shared/Notes.styles.ts";
import { Icon, Item, ListContainer, SummaryContainer } from "../SideBar.Styles.ts";
import { FaCalendar, FaCheckCircle, FaLightbulb, FaThumbtack, FaChevronUp, FaChevronDown, FaRegCalendar } from "react-icons/fa";
import { EmptyButton, IconButton } from "../../../styles/shared/Button.styles";
import { CountdownTimer } from "./CountdownTimer";
import { useActions } from "../../../context/ActionsContext";
import { LoadingSpinner } from "../../../styles/shared/LoadingSpinner";
import ReactMarkdown from "react-markdown";

export const ItemList = ({ items, title }: { items: string[], title: string }) => {
    const [showAll, setShowAll] = useState(false);
    const { updateTasks, updateEvents } = useActions();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfItems, setNumberOfItems] = useState(3);
    const cacheDuration = 1000 * 60 * 5; // 10 minutes


    const toggleShow = () => {
        if (!showAll) {
            setNumberOfItems(1);
            setIsLoading(true);
    
            //  && isCacheStale('tasks') - Remove cache for now
            if (title === 'Tasks') {
                updateTasks();
                localStorage.setItem('tasks_lastUpdated', Date.now().toString());
            } else if (title === 'Events') {
                updateEvents();
                localStorage.setItem('events_lastUpdated', Date.now().toString());
            } 
        
            setIsLoading(false);
        }
    
        setShowAll(prev => !prev);
    };

    const iconMap = {
        Tasks: <FaCheckCircle size={14} />,
        Events: <FaCalendar size={14} />,
    };

    return (
    <>
        <Row main='spaceBetween' cross='center'>
            <Row main='start' cross='center' gap='sm'>
                <Icon>
                    {iconMap[title as keyof typeof iconMap]}
                </Icon>
                <h2>{title}</h2>
            </Row>
            <IconButton onClick={toggleShow}>{showAll ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}</IconButton>
        </Row>
        {isLoading ? <LoadingSpinner /> :
            showAll && (
                <ListContainer>
                    <List onClick={() => setNumberOfItems(prev => prev + 3)}>
                        {items.slice(0, numberOfItems).map((item, index) => (
                            title === 'Events' ? (
                                <CountdownTimer key={index} eventString={item} />
                            ) : (
                                <ItemCard key={index}>
                                    <Item className="inline">
                                        <span className="content">{item}</span>
                                        <Icon>
                                            {title === 'Tasks' ? <FaThumbtack size={12} /> : <FaLightbulb size={12} />}
                                        </Icon>
                                    </Item>
                                </ItemCard>
                            )
                        ))}
                    </List>
                    {items.length > numberOfItems && (
                        <EmptyButton onClick={() => setNumberOfItems(prev => prev + 3)}>
                            <p>View more</p>
                        </EmptyButton>
                    )}
                </ListContainer>
            )
        }
        </>             
    );
};