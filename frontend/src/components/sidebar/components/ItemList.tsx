import { useState } from "react";
import { Row, List, ElevatedContainer } from "../../../styles/shared/BaseLayout";
import { ItemCard } from "../../../styles/shared/Notes.styles.ts";
import { Icon, Item, ListContainer, Circle, SnapshotContainer } from "../_styles";
import { FaBrain, FaCalendar, FaCheckCircle, FaLightbulb, FaThumbtack } from "react-icons/fa";
import { EmptyButton, IconButton, SecondaryButton } from "../../../styles/shared/Button.styles";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { CountdownTimer } from "./CountdownTimer";
import { useActions } from "../../../context/ActionsContext";
import { LoadingSpinner } from "../../../styles/shared/BaseLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export const ItemList = ({ items, title }: { items: string[], title: string }) => {
    const [showAll, setShowAll] = useState(false);
    const { updateTasks, updateEvents, summary } = useActions();
    const [isLoading, setIsLoading] = useState(false);
    const [numberOfItems, setNumberOfItems] = useState(3);
    const CACHE_DURATION_MS = 1000 * 60 * 15; // 15 minutes

    const isCacheStale = (key: string): boolean => {
        const timestamp = localStorage.getItem(`${key}_lastUpdated`);
        if (!timestamp) return true;
        return Date.now() - parseInt(timestamp, 10) > CACHE_DURATION_MS;
    };

    const toggleShow = () => {
        if (!showAll) {
            setNumberOfItems(3);
            setIsLoading(true);
    
            if (title === 'Tasks' && isCacheStale('tasks')) {
                updateTasks();
                localStorage.setItem('tasks_lastUpdated', Date.now().toString());
            } else if (title === 'Events' && isCacheStale('events')) {
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
        Snapshot: <FaLightbulb size={14} />
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
            {items.length > 0 && (
                <IconButton onClick={toggleShow}>{showAll ? <MdArrowDropDown size={22} /> : <MdArrowDropUp size={22} />}</IconButton>
            )}
        </Row>
        {isLoading ? <LoadingSpinner /> :
            showAll && (
                title === 'Snapshot' ? (
                    <SnapshotContainer>
                        {items.map((item, index) => (
                            <Item key={index} className="inline">
                                <ReactMarkdown>{item}</ReactMarkdown>
                                <br />
                            </Item>
                        ))}
                    </SnapshotContainer>
                ) : (
                <ListContainer>
                    <List onClick={() => setNumberOfItems(prev => prev + 3)}>
                        {items.slice(0, numberOfItems).map((item, index) => (
                            title === 'Events' ? (
                                <CountdownTimer key={index} eventString={item} />
                            ) : (
                                <ItemCard key={index}>
                                    <Item className="inline">
                                        <span className="content"><ReactMarkdown>{item}</ReactMarkdown></span>
                                        <Icon>
                                            {title === 'Tasks' ? <FaThumbtack size={12} /> : <FaLightbulb size={12} />}
                                        </Icon>
                                    </Item>
                                </ItemCard>
                            )
                        ))}
                    </List>
                        {/*
                    {items.length > numberOfItems && (
                        <EmptyButton onClick={() => setNumberOfItems(prev => prev + 3)}>+</EmptyButton>
                    )}*/}
                </ListContainer>
                )
            )}
        </>             
    );
};