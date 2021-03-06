import { WeaponCard } from "./weaponCard";
import {
    Badge,
    Button,
    Card,
    Col,
    Dropdown,
    DropdownButton,
    FormControl,
    FormGroup,
    FormLabel,
    OverlayTrigger,
    ProgressBar,
    Row,
    Tooltip
} from "react-bootstrap";
import React, { useState } from "react";
import "./armoury.scss";
import { useAppDispatch, useAppSelector } from "../../general/hooks";
import { addItem } from "../inventory/inventorySlice";
import { ISpell, IWeapon, removeGear, setMaxWounds, setWounds } from "./armourySlice";
import { SpellCard } from "./spellCard";
import { BiTargetLock, FaDiceD20, IoReloadCircle } from "react-icons/all";
import { rollInitAndSendToDiscord } from "../character/Rolls";
import { EItemCategory } from "../character/EItemCategory";
import { addTalent, removeTalent, EGods } from "../talents/talentSlice";
import { setDevotion } from "../character/characterSlice";
import { TalentEntryFunction } from "../talents/talentEntry";
import { allTalents } from "../character/resources";
import { ICharacteristics, incrementBonus } from "../characteristics/characteristicsSlice";

export const Armoury = () => {

    const imageHead = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22height%3A%20512px%3B%20width%3A%20512px%3B%22%3E%3Cpath%20d%3D%22M0%200h512v512H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3Cg%20class%3D%22%22%20transform%3D%22translate(0%2C0)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M257.375%2032.03C139.957%2087.197%2042.343%20247.886%2017.5%20367.75c71.742%200%20124.22%2022.845%20162.094%2063.03l10.47-11.436c-28.06-28.873-64.935-52.446-113.564-75.906%2026.142-65.033%2066.028-163.458%20116.72-169.188%2019.835-2.243%2041.05%209.735%2064.155%2043.438%2072.33-120.27%20141.014%2038.54%20180.875%20125.75-47.687%2025.854-84.5%2049.463-112.97%2078.718l9.25%2010.406c37.335-39.758%2089.657-64.812%20162.72-64.812C467.784%20249.384%20377.24%2090.37%20257.375%2032.03zm-79.72%20243.314c-15.3-.083-26.405%206.436-26.405%2016.656%200%2012.58%2016.834%2026.038%2037.594%2030.063%2020.76%204.024%2037.594-2.92%2037.594-15.5s-16.835-26.038-37.594-30.063c-3.893-.755-7.657-1.137-11.188-1.156zm156.345%200c-3.53.02-7.295.4-11.188%201.156-20.76%204.025-37.593%2017.483-37.593%2030.063%200%2012.58%2016.833%2019.524%2037.592%2015.5%2020.76-4.025%2037.594-17.484%2037.594-30.063%200-10.22-11.105-16.74-26.406-16.656z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    const imageBody = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22height%3A%20512px%3B%20width%3A%20512px%3B%22%3E%3Cpath%20d%3D%22M0%200h512v512H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3Cg%20class%3D%22%22%20transform%3D%22translate(-1%2C-7)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M208%2056.643l-16%2064-98.568%2014.082L256%20175.365l162.568-40.64L320%20120.643l-16-64-27.268%2018.18-12.002%2048.003h-17.46l-12.002-48.004zm-138.621%2090.62L16%20200.644l48%2064%2025.77-25.77%2026.619-79.857zm373.242%200l-47.01%2011.753%2026.62%2079.857L448%20264.643l48-64zm-308.717%2016.132l-20.123%2060.369%2013.81%2055.246L247%20345.348V191.67zm244.192%200L265%20191.67v153.678l119.408-66.338%2013.81-55.246zM144%20308.715v56.314l103%2030.627v-29.719zm224%200l-103%2057.223v29.718l103-30.627zm-224%2075.54v56.388l103%2014.714V414.88zm224%200L265%20414.88v40.478l103-14.714z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    const imageArmL = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22height%3A%20512px%3B%20width%3A%20512px%3B%22%3E%3Cpath%20d%3D%22M0%200h512v512H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3Cg%20class%3D%22%22%20transform%3D%22translate(-1%2C-7)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M256%2026C192%2058%20112%2080%2032%2080c0%2046.047%204.726%2089.503%2013.02%20129.69%2025.495-2.558%2053.13-2.433%2081.86-1.06l-7.61-30.446-2.022-8.086%2065.898-21.967%2010.866%2065.194c28.32%202.336%2056.907%204.82%2084.9%206.238%2014.357-4.67%2028.073-8.33%2040.43-14.36l7.78-46.682%201.732-10.39%2065.898%2021.968-9.578%2038.316c9.207%204.926%2020.403%2014.91%2023.97%2022.346%203.352%207.302%202.696%2015.333.256%2024.154%202.27%206.21%202.31%2012.947.43%2019.287-1.65%205.57-4.95%2010.974-9.844%2014.974.41%2010.106-5.414%2019.52-14.597%2023.353-5.045%2010.42-15.085%2022.05-25.146%2025.678a35.325%2035.325%200%200%201-7.943%201.7l-10.29%2041.16-47.98-23.99%207.107-42.647c-7.178-2.867-14.753-6.176-23.147-9.758-22.506%202.868-45.05%205.7-67.385%208.213l7.366%2044.193-47.98%2023.99-15.668-62.668c-25.372%202.034-50.16%203.29-73.943%203.288C126.423%20426.23%20197.21%20490%20256%20490c96%200%20224-170%20224-410-80%200-160-22-224-54zm-87.146%20145.87l-30.102%2010.034%2043.258%20173.028%2016.02-8.008-29.176-175.055zm174.292%200l-3.927%2023.562c9.757-4.082%2021.374-8.826%2031.514-3.473l2.514-10.058-30.102-10.033zm17.692%2035.696c-5.508.754-15.244%204.655-25.35%209.72-18.843%2011.052-35.297%2013.47-53.963%2020.448-29.314-1.518-59.264-3.89-84.43-5.912l10.538%2063.23c25.773-2.928%2050.59-5.99%2072.93-8.845%208.035%203.372%2016.415%207.06%2023.603%2010.05l5.156-30.943-.492-16.046c31.396-.965%2040.955-17.8%2046.625-26.14%202.25-3.306%204.94-9.64%205.424-13.554.162-1.32.03-1.567-.042-2.008zm14.598%2016.305c-2.703%205.724-5.283%209.687-7.97%2014.567%207.198%203.907%2015.487%205.786%2025.923%206.215.426-2.995.116-4.813-.605-6.382-1.195-2.604-5.27-6.648-13.826-12.715-1.51-.91-2.674-1.404-3.524-1.684zm-284.63%202.026c-22.55-.09-43.69%201.063-62.732%204.256-10.604%2021.43-9.975%2044.448%201.57%2071.08%2036.332%203.616%2077.178%202.643%20120.223-.662l-18.35-73.406c-13.955-.738-27.575-1.215-40.71-1.268zm263.41%2025.303a71.374%2071.374%200%200%201-5.972%204.34c2.293%209.34%2010.7%2011.83%2019.822%2013.91%207.76%201.73%2016.358%202.576%2023.13%202.802a14.133%2014.133%200%200%200%201.376-3.166c.653-2.202.702-4.555.38-6.48-14.655-.713-27.626-4.258-38.737-11.407zm-21.835%2012.025a73.26%2073.26%200%200%201-4.694%201.41l-2.053%2012.32a25.18%2025.18%200%200%201%208.056-10.383%2031.58%2031.58%200%200%201-1.31-3.347zm12.872%2017.345c-1.468.894-2.713%202.34-3.195%203.817-.638%201.953-1.09%203.368%201.755%205.533%203.645%202.138%209.51%204.437%2015.745%205.613%205.123.967%2010.54%201.276%2014.804%201.205l2.876-.467c1.974-.318%204.624-3.515%204.752-6.553-5.69-.506-11.804-1.355-17.836-2.7-6.592-1.47-13.14-3.327-18.9-6.447zm-21.23%206.04l-10.05%2060.314%2016.018%208.008%204.72-18.88c-9.425-5.795-14.6-14.962-14.468-23.888.085-5.812%202.58-11.444%206.653-15.617-1.686-3.174-2.65-6.586-2.872-9.936zm15.933%2021.91c-1.2.71-1.687%202-1.715%203.908-.04%202.678%201.262%206.588%208.574%209.61.664.133%203.335.59%207.618-.87%202.824-.963%206.072-2.797%209.226-6.81a108.078%20108.078%200%200%201-7.44-1.137c-5.542-1.045-11.13-2.444-16.263-4.7z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    const imageArmR = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22height%3A%20512px%3B%20width%3A%20512px%3B%22%3E%3Cpath%20d%3D%22M0%200h512v512H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3Cg%20class%3D%22%22%20transform%3D%22translate(0%2C-6)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M122.1%2017.52L186.6%20161l104.5-44.9-44.5-98.58h-51.1l35.8%2080.75-16.4%207.23-39-87.98zm265.2%2077.75L110.4%20215.2l12%2028.2%20278.1-119.8zm-69.7%2098.53l-23.9%2011.5c12.8%205.4%2026%2013.7%2038.3%2015.6%2018.1-13.1-4.9-30.5-14.4-27.1zm-60.7%2011.1l-36.2%2016.7c-11.9%2018.4-14.8%2046-18.2%2069.7%2020.6%2030.1%2030.5%2062.4%2039.5%2094%2017.9-3.7%2032.2-6.8%2048.7-11.5-24.4-38.7-42.2-78.4-53.6-118.9%200%200%205.6-10.5%208.4-15.8%2011.9%207.3%2024.9%2012.4%2036.6%209.9%2010-4.1%2021.5-7.9%2027.7-16.6-17.6-6.9-37.1-17.5-52.9-27.5zm92.6%2026.6c-10.8%205.8-23%2011.2-31.9%2018.9-5.3%204.7-12.1%208.8-20.5%2012.3%201.1%207.3-.1%2019.6%208.1%2018.8%2020.5-6.2%2040.5-15%2059.7-28.4-.1-9.2-8-24.1-15.4-21.6zm-90.2%2034.2c11.3%2034.8%2027.6%2069%2049.3%20102.6%204.7-1.6%209.3-3.3%2013.5-5-7.3-6.2-11.7-15.9-12-25.3-16.6-4.1-20.8-29.4-17.2-41.6-9.5-7-13.6-18.1-14.2-28.7-7.2.7-13.6-.1-19.4-2zm103.3%2010.4c-13.6%208.1-27.6%2014.3-41.6%2019.2l-9%204.4c-4.4%204.6-4.5%2015.6%201%2020.3%209.7%203.5%2050.1-21.2%2057.7-27.9%201.3-5.8-3.5-14.9-8.1-16zm-178.1%2021.2L19.1%20335.8V495c95.7-25.3%20146.9-47.1%20209.7-90.2-10.8-38-20.5-74.8-44.3-107.5zm187.8%2016.9c-13.6%2010.2-27.2%2016.2-42.9%2021.4-.4%206.7%202.5%2018.1%2012.1%2016%2019.9-4.3%2036.3-17.5%2036.6-24.6.2-3.7-2-10.5-5.8-12.8zm-7.5%2048.6c-14.3%208.2-31.5%2015.9-46.7%2021.4l18.7%2031.8%2039.3-18.8zm22.2%2049.1L342.9%20433l3.1%2021.9c15.1.5%2046.6-11.3%2055.4-26.1v-.1z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22%20transform%3D%22translate(512%2C%200)%20scale(-1%2C%201)%20rotate(0%2C%20256%2C%20256)%20skewX(0)%20skewY(0)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    const imageLegR = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22height%3A%20512px%3B%20width%3A%20512px%3B%22%3E%3Cpath%20d%3D%22M0%200h512v512H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3Cg%20class%3D%22%22%20transform%3D%22translate(0%2C0)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M269%2023.95l-87.7.1c1.1%2061.4-2.4%20116.05-14%20159.45-9%2034-23.6%2061.6-45.2%2079-.1%209.5-.8%2019-2.1%2028.6-3.1%2022.9-13.5%2043.2-22.75%2065%2023.55-1.3%2043.55-11.6%2065.35-24.8%2020.6-12.5%2042.4-27.5%2068.9-37.8-.2-1.4-.4-2.9-.4-4.2-1.9-23.7.1-52.2%204.1-83.2C243%20147.6%20257.9%2081.05%20269%2023.95zm-105.7.1H80.65c-1.6%2036.5%2010.1%2076.15%2021.65%20119.15%208.3%2030.4%2016.5%2062.3%2019%2095.7%2012.6-14.3%2021.8-34.4%2028.6-60%2010.8-40.6%2014.4-94.15%2013.4-154.85zm41.8%2014.9a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm-2.4%2052.5a9%209%200%200%201%20.1%200%209%209%200%200%201%209%208.95%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-8.95zm-5.9%2056.25a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm-16%2060.6a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm-32%2048.1a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm85.7%2055.3c-22.6%209.6-42.3%2022.9-62.6%2035-24.6%2014.9-50.5%2027.9-81.85%2027.5-8.2%2022.7-13.8%2048-10%2079.9h82.35c13.2-41.4%2042.9-78%2095.1-106.8-1.4-1-2.9-2.1-4.3-3.2-9.6-7.6-15.3-18.8-18.7-32.4zm40.2%2046.7c-52.1%2026.2-80.4%2058.5-93.6%2095.7h127.4c0-14.3.6-29%203.9-43.6%202.6-11.5%207-22.9%2014-33.9-16.1-3.3-33.5-8.1-51.7-18.2zm70.8%2021.8c-8.2%2010.9-12.8%2022.3-15.5%2034.3-2.8%2012.5-3.5%2025.8-3.5%2039.6h104c-2-17.8-12.5-39.8-28.1-52.1-17.8-13.9-36-17.9-56.9-21.8zm8.3%2010.5a9%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%209-9zm-254.05%2035a9%209%200%200%201%20.1%200%209%209%200%200%201%208.95%209%209%209%200%200%201-8.95%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm44.85.6a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm201.5.1a9%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%209-9zM72.05%20470v18.1H440V470z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22%20transform%3D%22translate(512%2C%200)%20scale(-1%2C%201)%20rotate(0%2C%20256%2C%20256)%20skewX(0)%20skewY(0)%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E';
    const imageLegL = 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20512%20512%22%20style%3D%22height%3A%20512px%3B%20width%3A%20512px%3B%22%3E%3Cpath%20d%3D%22M0%200h512v512H0z%22%20fill%3D%22%23000%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3Cg%20class%3D%22%22%20transform%3D%22translate(0%2C0)%22%20style%3D%22%22%3E%3Cpath%20d%3D%22M269%2023.95l-87.7.1c1.1%2061.4-2.4%20116.05-14%20159.45-9%2034-23.6%2061.6-45.2%2079-.1%209.5-.8%2019-2.1%2028.6-3.1%2022.9-13.5%2043.2-22.75%2065%2023.55-1.3%2043.55-11.6%2065.35-24.8%2020.6-12.5%2042.4-27.5%2068.9-37.8-.2-1.4-.4-2.9-.4-4.2-1.9-23.7.1-52.2%204.1-83.2C243%20147.6%20257.9%2081.05%20269%2023.95zm-105.7.1H80.65c-1.6%2036.5%2010.1%2076.15%2021.65%20119.15%208.3%2030.4%2016.5%2062.3%2019%2095.7%2012.6-14.3%2021.8-34.4%2028.6-60%2010.8-40.6%2014.4-94.15%2013.4-154.85zm41.8%2014.9a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm-2.4%2052.5a9%209%200%200%201%20.1%200%209%209%200%200%201%209%208.95%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-8.95zm-5.9%2056.25a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm-16%2060.6a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm-32%2048.1a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm85.7%2055.3c-22.6%209.6-42.3%2022.9-62.6%2035-24.6%2014.9-50.5%2027.9-81.85%2027.5-8.2%2022.7-13.8%2048-10%2079.9h82.35c13.2-41.4%2042.9-78%2095.1-106.8-1.4-1-2.9-2.1-4.3-3.2-9.6-7.6-15.3-18.8-18.7-32.4zm40.2%2046.7c-52.1%2026.2-80.4%2058.5-93.6%2095.7h127.4c0-14.3.6-29%203.9-43.6%202.6-11.5%207-22.9%2014-33.9-16.1-3.3-33.5-8.1-51.7-18.2zm70.8%2021.8c-8.2%2010.9-12.8%2022.3-15.5%2034.3-2.8%2012.5-3.5%2025.8-3.5%2039.6h104c-2-17.8-12.5-39.8-28.1-52.1-17.8-13.9-36-17.9-56.9-21.8zm8.3%2010.5a9%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%209-9zm-254.05%2035a9%209%200%200%201%20.1%200%209%209%200%200%201%208.95%209%209%209%200%200%201-8.95%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm44.85.6a9%209%200%200%201%20.1%200%209%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%208.9-9zm201.5.1a9%209%200%200%201%209%209%209%209%200%200%201-9%209%209%209%200%200%201-9-9%209%209%200%200%201%209-9zM72.05%20470v18.1H440V470z%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E';

    const stats = useAppSelector(state => state.characteristics);
    const infamyStat = stats['INF'];
    const toughnessStat = stats["T"];
    const agilityStat = stats["AG"];
    const armouryState = useAppSelector(state => state.armoury);
    const character = useAppSelector(state => state.character);
    const talents = useAppSelector(state => state.talents)
    const experience = useAppSelector(state => state.experience)
    const dispatch = useAppDispatch()

    const [agilityBonus, setAgilityBonus] = useState(2);

    const agility = Math.floor(agilityStat.value / 10 + agilityStat.bonus + agilityBonus);
    const armour = armouryState.armour;
    const maxHealth = armouryState.character.maxWounds;
    const maxInfamy: number = Math.floor(infamyStat.value / 10 + infamyStat.bonus);
    const maxFatigue: number = Math.floor(toughnessStat.value / 10 + toughnessStat.bonus);

    const [infamy, setInfamy] = useState(maxInfamy);
    const [fatigue, setFatigue] = useState(0);
    const [showTarget, setShowTarget] = useState(true);
    const [maxWoundsEditable, setMaxWoundsEditable] = useState(false)

    const health = armouryState.character.currentWounds;

    function calcWoundLabel() {
        const heavilyWounded = (health > (toughnessStat.value / 10 + toughnessStat.bonus) * 2) ? "Heavy Wounded - " : "";
        return `${heavilyWounded}${health > maxHealth ? `CRIT: ${health - maxHealth}` : `${health}/${maxHealth}`}`;
    }

    const dropItems = [<Dropdown.Header key={`init-modifier-header`}>Init Modifier</Dropdown.Header>];
    for (let i = 10; i > -10; i -= 1) {
        dropItems.push(<Dropdown.Item key={`init-modifier-${i}`} onClick={() => setAgilityBonus(i)}>{i}</Dropdown.Item>);
    }

    function resetDevotion() {
        const h = Object.entries(calcDevotion())
            .filter(value => value[0] !== "Unaligned")
            .sort((a, b) => b[1] - a[1])
        ;


// If the highest devotion is 5 greater than the second the character is aligned
        if (h[0][1] - h[1][1] >= 5) {
            const newDevotion = h[0][0];
            if (newDevotion !== character.devotion) {
                // Remove old Mark
                dispatch(removeTalent(talents[`Mark of ${character.devotion}`]))
                dispatch(setDevotion(newDevotion))
            }
            if (h[0][1] >= 20) {
                if (!talents[`Mark of ${newDevotion}`]) { // Only grant once
                    grantAdditionalBenefits(newDevotion);
                    dispatch(addTalent(allTalents[`Mark of ${newDevotion}`]));
                }
            }
        } else {
            dispatch(setDevotion("Unaligned"));
            dispatch(removeTalent(talents[`Mark of ${character.devotion}`]))
        }
    }

    /**
     * Additional Benefits:
     * Khorne: The character gains the Resistance (Psychic Powers), Talent, the Brutal Charge Trait, and Unnatural Strength (+2)
     * Nurgle: The character gains the Stuff of Nightmares and Unnatural Toughness (+1) Traits
     * Slaanesh: The character gains the Heightened Senses (All) Talent and the Unnatural Fellowship (+2) Trait
     * Tzeentch: The character gains the Unnatural Willpower (+1) Trait and the Psy Rating (+1) Talent
     */
    function grantAdditionalBenefits(devotion: string) {
        switch (devotion) {
            case EGods.NURGLE:
                dispatch(addTalent(allTalents["The Stuff of Nightmares"]));
                grantUnnaturalStat(toughnessStat)
                break;
            case EGods.KHORNE:
                dispatch(addTalent(allTalents["Brutal Charge"]));
                const name = "Resistance"
                const t = talents[name] || allTalents[name]
                dispatch(addTalent({...t, specialization: ["Psychic Powers" + t.specialization].join()}));
                grantUnnaturalStat(stats["S"], 2)
                break;
            case EGods.SLAANESH:
                const ts = allTalents["Heightened Senses"]
                dispatch(addTalent({...ts, specialization: "all"}));
                grantUnnaturalStat(stats["FEL"], 2)
                break;
            case EGods.TZEENTCH:
                const namet = "Psy Rating";
                const tt = talents[namet] || allTalents[namet]
                dispatch(addTalent({...tt, specialization: increaseSpecialization(tt.specialization)}));
                grantUnnaturalStat(stats["WP"])
                break;
            default: return
        }

    }

    function grantUnnaturalStat(stat: ICharacteristics, amount: number = 1) {
        const name = `Unnatural ${stat.name}`
        let talent = talents[name];
        if (talent) {
            // Stat already present increase by one
            talent = {...talent, specialization: increaseSpecialization(talent.specialization)}
        } else {
            talent = allTalents["Unnatural Characteristic"];
            talent = {...talent, name, specialization: "1"}
        }
        dispatch(addTalent(talent));
        for (let i = 0; i < amount; i++) {
            dispatch(incrementBonus(stat.short));
        }
    }

    function increaseSpecialization(spec: string | undefined): string {
        return "" + (parseInt(spec || "0") + 1);
    }

    function calcDevotion() {
        const counts = {
            [EGods.UNALIGNED]: 0,
            [EGods.SPECIAL]: 0,
            [EGods.KHORNE]: 0,
            [EGods.SLAANESH]: 0,
            [EGods.TZEENTCH]: 0,
            [EGods.NURGLE]: 0,
        }
        Object.values(talents).flatMap(t => t.devotion)
            .filter((v => v))
            .forEach(value => counts[value]++);
        // Only aligned Talent which can be taken multiple times
        const t = talents["Sound Constitution"]
        if (t) {
            for (let i = 1; i < parseInt(t.specialization || "1"); i++) {
                counts["Nurgle"]++
            }
        }
        experience.entries.filter(v => v.devotion).forEach(e => {
            if (e.type === "CHAR" || e.type === "SPELL" || e.type === "SKILL") {
                counts[e.devotion]++
            }
        });
        return counts;
    }

    return <div>
        <Row>
            <Col>
                <h3>Armoury</h3>
            </Col>
        </Row>
        <Row>
            <Col>
                {/* BEGIN WEAPONS*/}
                <Row>
                    <Col>
                        {Object.values(armouryState.weapons).map(((weapon) =>
                                <div key={`wp-${weapon.name}`}>
                                    {weapon.category === EItemCategory.WEAPON ? <WeaponCard weapon={weapon as IWeapon}/>
                                        : weapon.category === EItemCategory.SPELL ?
                                            <SpellCard spell={weapon as ISpell}/> : <></>
                                    }
                                </div>
                        ))}
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col md={5}>
                        {Object.values(armouryState.gear).map(gear => (
                            <Row key={`gear-${gear.name}`}>
                                <Col md={10}>{gear.name}</Col>
                                <Col md={2}> <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        dispatch(removeGear(gear));
                                                        dispatch(addItem(gear))
                                                    }}>-</Badge>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                    <Col md={{ span: 3 }}><Card> <Card.Img src={imageHead}/>
                        <Card.ImgOverlay>
                            <Badge className={"armoury-badge"} variant={"secondary"} pill>{armour.head}</Badge>
                            {showTarget ? <Badge variant={"dark"}>(1-10)</Badge> : undefined}
                        </Card.ImgOverlay></Card>
                    </Col>
                    <Col>
                        <Row>
                            <Col>
                                <Row>
                                    <Button variant={showTarget ? "primary" : "secondary"} onClick={() => setShowTarget(!showTarget)}><BiTargetLock/>
                                    </Button>
                                </Row>
                                <Row>
                                    <Button
                                        onClick={() => rollInitAndSendToDiscord(character.discord[character.discord.active], character.characterName, agility, 1, 10)}
                                        variant={"light"}><FaDiceD20 color={"darkred"} style={{ cursor: "pointer" }}/> Init
                                    </Button>
                                    <DropdownButton size="sm" title={agilityBonus} variant={'secondary'}>
                                        {dropItems}
                                    </DropdownButton>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ offset: 2, span: 3 }}><Card> <Card.Img src={imageArmR}/>
                        <Card.ImgOverlay>
                            <Badge className={"badge-armoury badge-secondary"} pill>{armour.armR} </Badge>
                            {showTarget ? <Badge variant={"dark"}>(11-20)</Badge> : undefined}
                        </Card.ImgOverlay>
                    </Card></Col>
                    <Col md={{ span: 3 }}><Card> <Card.Img src={imageBody}/>
                        <Card.ImgOverlay>
                            <Badge className={"armoury-badge"} variant={"secondary"} pill>{armour.body}</Badge>
                            {showTarget ? <Badge variant={"dark"}>(31-70)</Badge> : undefined}
                        </Card.ImgOverlay>
                    </Card></Col>
                    <Col md={{ span: 3 }}><Card> <Card.Img src={imageArmL}/>
                        <Card.ImgOverlay>
                            <Badge className={"armoury-badge"} variant={"secondary"} pill>{armour.armL}</Badge>
                            {showTarget ? <Badge variant={"dark"}>(21-30)</Badge> : undefined}
                        </Card.ImgOverlay>
                    </Card></Col>
                </Row>
                <Row>
                    <Col md={{ offset: 3, span: 3 }}><Card> <Card.Img src={imageLegR}/>
                        <Card.ImgOverlay>
                            <Badge className={"armoury-badge"} variant={"secondary"} pill>{armour.legR}</Badge>
                            {showTarget ? <Badge variant={"dark"}>(71-85)</Badge> : undefined}
                        </Card.ImgOverlay>
                    </Card></Col>
                    <Col md={{ offset: 1, span: 3 }}><Card> <Card.Img src={imageLegL}/>
                        <Card.ImgOverlay>
                            <Badge className={"armoury-badge"} variant={"secondary"} pill>{armour.legL}</Badge>
                            {showTarget ? <Badge variant={"dark"}>(86-100)</Badge> : undefined}
                        </Card.ImgOverlay>
                    </Card></Col>
                </Row>

                {/* WOUNDS */}
                <Row>
                    <Col md={2}>Wounds:</Col>
                    <Col md={8}>
                        {maxWoundsEditable ?
                            <FormGroup as={Row}>
                                <FormLabel column sm={5}>Max Wounds:</FormLabel>
                                <Col sm={7}>

                                    <FormControl value={maxHealth}
                                                 onChange={(event) => dispatch(setMaxWounds(event.target.value))}
                                                 onMouseLeave={() => setMaxWoundsEditable(false)}
                                                 autoFocus/>
                                </Col>
                            </FormGroup>
                            :
                            <ProgressBar>
                                <ProgressBar variant={"danger"} animated={health > maxHealth} now={health}
                                             max={maxHealth}
                                             label={health >= maxHealth / 2 ? calcWoundLabel() : undefined}
                                             onClick={() => setMaxWoundsEditable(true)}/>
                                <ProgressBar variant={"secondary"}
                                             label={health < maxHealth / 2 ? calcWoundLabel() : undefined}
                                             now={maxHealth + 10 - health} max={maxHealth + 10}
                                             onClick={() => setMaxWoundsEditable(true)}/>
                            </ProgressBar>
                        }
                    </Col>
                    <Col md={2}>
                        <div>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(setWounds(Math.max(health - 1, 0)))}>-</Badge>
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => dispatch(setWounds(Math.min(health + 1, maxHealth + 10)))}>+</Badge>
                        </div>
                    </Col>
                </Row>

                {/* INFAMY */}
                <Row>
                    <Col md={2}>Infamy: </Col>
                    <Col md={8}>
                        <ProgressBar>
                            <ProgressBar variant={"success"} now={infamy} max={maxInfamy}
                                         label={`${infamy}/${maxInfamy}`}/>
                            <ProgressBar variant={"secondary"} now={maxInfamy - infamy} max={maxInfamy}/>
                        </ProgressBar>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                                   onClick={() => setInfamy(infamy - 1)}>-</Badge>
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => setInfamy(Math.min(infamy + 1, maxInfamy))}>+</Badge>
                        </div>
                    </Col>
                </Row>

                {/* FATIGUE */}
                <Row>
                    <Col md={2}>Fatigue: </Col>
                    <Col md={8}>
                        <ProgressBar>
                            <ProgressBar variant={"warning"} now={fatigue} max={maxFatigue}
                                         label={`${fatigue}/${maxFatigue}`}/>
                            <ProgressBar variant={"secondary"} now={maxFatigue - fatigue} max={maxFatigue}/>
                        </ProgressBar>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Badge variant={'danger'} style={{ cursor: 'pointer' }}
                                   onClick={() => setFatigue(fatigue - 1)}>-</Badge>
                            <Badge variant={'success'} style={{ cursor: 'pointer' }}
                                   onClick={() => setFatigue(Math.min(fatigue + 1, maxFatigue))}>+</Badge>
                        </div>
                    </Col>
                </Row>

                {/* DEVOTION */}
                <Row>
                    <Col md={2}>Devotion:</Col>
                    <Col md={2}>
                        <OverlayTrigger
                            overlay={
                                <Tooltip id={`remove`}>
                                    {JSON.stringify(Object.entries(calcDevotion()))}
                                </Tooltip>
                            }>
                            <Badge pill style={{
                                backgroundColor: 'brown',
                                color: 'white'
                            }}>{character.devotion ? character.devotion : EGods.UNALIGNED}</Badge>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2}><IoReloadCircle style={{ cursor: 'pointer' }} color={'green'} onClick={() => resetDevotion()}/> </Col>
                </Row>

                {/* MOVEMENT */}
                <Row>
                    <Col md={2}>Movement:</Col>
                    <Col md={5}>
                        <Row>
                            <Col>HALF ({agilityStat.value / 10 + agilityStat.bonus}) </Col>
                        </Row>
                        <Row>
                            <Col>FULL ({(agilityStat.value / 10 + agilityStat.bonus) * 2}) </Col>
                        </Row>
                    </Col>
                    <Col md={5}>
                        <Row>
                            <Col>CHARGE ({(agilityStat.value / 10 + agilityStat.bonus) * 3}) </Col>
                        </Row>
                        <Row>
                            <Col>RUN ({(agilityStat.value / 10 + agilityStat.bonus) * 4}) </Col>
                        </Row>
                    </Col>
                </Row>

                {/* Gift of the Gods */}
                <Row>
                    <Col>
                        Gift of the Gods
                    </Col>
                </Row>
                <Row>
                    {Object.values(talents).filter(value => value.tier < 0)
                        .map(value => <TalentEntryFunction key={`armoury-talent-entry-${value.name}`} {...value} setActiveTalent={() => null}/>)
                    }
                </Row>

            </Col>

        </Row>
    </div>


}

export function reverseNumber(value: number) {
    const s = value.toString().length === 1 ? '0' + value.toString() : value.toString()

    return parseInt(s.split("").reverse().join(""));
}

export function getHitLocation(rollValue: number) {
    const reverse = reverseNumber(rollValue);

    if (reverse < 11) {
        return "Head";
    } else if (reverse < 21) {
        return "Right Hand";
    } else if (reverse < 31) {
        return "Left Hand";
    } else if (reverse < 71) {
        return "Body";
    } else if (reverse < 86) {
        return "Right Leg";
    } else {
        return "Left Leg"
    }


}

