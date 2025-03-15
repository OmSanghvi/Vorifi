import * as React from 'react';
import {Card, CardContent, CardActions, Typography, CircularProgress, SvgIcon, Button} from '@mui/joy';
import {cn, formatCurrency, formatPercentage} from "@/lib/utils";
import {IconType} from "react-icons";
import {CountUp} from "./count-up";
import {Skeleton} from "./ui/skeleton";

type DataCardProps = {
    icon: IconType,
    title: string,
    value?: number,
    dateRange: string,
    percentageChange?: number,
    variant?: 'default' | 'success' | 'danger' | 'warning',
    className?: string,
};

export const DataCard = ({
                             icon: Icon,
                             title,
                             value = 0,
                             variant = 'default',
                             dateRange,
                             percentageChange = 0,
                             className
                         }: DataCardProps) => {
    return (
        <Card
            variant="solid"
            color={variant as 'primary' | 'success' | 'danger' | 'warning'}
            className={cn(
                "bg-white dark:bg-gray-800 shadow-sm",
                className
            )}
        >
            <div className="flex items-center">
                <div className="mr-auto -mt-14">
                    <CircularProgress
                        size="lg"
                        determinate
                        value={percentageChange > 0 ? Math.min(percentageChange, 100) : 0}
                        className="dark:text-gray-300"
                    >
                        <SvgIcon className="dark:text-gray-300">
                            <Icon/>
                        </SvgIcon>
                    </CircularProgress>
                </div>
                <div className="mr-8">
                    <Typography
                        level="h2"
                        className="text-gray-900 dark:text-gray-100"
                    >
                        {title}
                    </Typography>
                    <Typography
                        level="body-md"
                        className="text-gray-600 dark:text-gray-300"
                    >
                        {dateRange}
                    </Typography>
                    <CardContent>
                        <Typography
                            level="h2"
                            className="text-gray-900 dark:text-white"
                        >
                            {formatCurrency(value)}
                        </Typography>
                        <Typography
                            level="body-md"
                            className={cn(
                                "whitespace-nowrap",
                                percentageChange > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}
                        >
                            {formatPercentage(percentageChange, {addPrefix: true})} from last period
                        </Typography>
                    </CardContent>
                </div>
            </div>
        </Card>
    );

};
export const DataCardLoading = () => {
    return (
        <Card variant="solid" color="primary" className="bg-white dark:bg-gray-800 text-black dark:text-white"
              style={{boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
            <Skeleton className="h-6 w-24"/>
            <Skeleton className="h-4 w-40"/>
            <div style={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
                <Skeleton className="shrink-0 h-10 w-10"/>
            </div>
            <CardContent>
                <Skeleton className="shrink-0 h-10 w-24 mb-2"/>
                <Skeleton className="shrink-0 h-4 w-40"/>
            </CardContent>
        </Card>
    );
};