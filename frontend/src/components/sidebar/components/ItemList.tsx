import { useState } from "react";
import { Row, List } from "../../../styles/shared/BaseLayout";
import { Icon, Item } from "../_styles";
import { FaBrain, FaCalendar, FaCheckCircle } from "react-icons/fa";
import { IconButton } from "../../../styles/shared/Button.styles";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { CountdownTimer } from "./CountdownTimer";

export const ItemList = ({ items, title }: { items: string[], title: string }) => {
    const [showAll, setShowAll] = useState(false);
    const toggleShow = () => setShowAll(prev => !prev);

    const iconMap = {
        Tasks: <FaCheckCircle size={14} />,
        Events: <FaCalendar size={14} />,
        Insights: <FaBrain size={14} />
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
        <List>
            {showAll && items.map((item, index) => (
                title === 'Events' ? (
                    <CountdownTimer key={index} eventString={item} />
                ) : (
                    <Item key={index} className="inline">
                    <span className="content">{item}</span>
                    </Item>
                )
            ))}
        </List>
    </>             
    );
};