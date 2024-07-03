/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { Container, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { team } from '../store/Team';
import { metrics } from '../store/Metrics';
import {
	Area,
	AreaChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
} from 'recharts';
import moment from 'moment';
import { css } from '@emotion/react';

function Metrics() {
	useEffect(() => {
		getMetrics();
	}, [team.selectedTeam.id]);

	async function getMetrics() {
		await metrics.getMetrics();
	}
	const tickFormatter = (value: number) => {
		const date = new Date(value * 1000);
		const formattedDate = moment(date).format('DD MMM');
		return formattedDate;
	};

	return (
		<Container
			sx={{
				marginTop: '1rem',
				borderRadius: '3px',
				padding: '1rem',
			}}
		>
			<Typography variant='h5' sx={{ marginBottom: '1rem' }}>
				Metrics
			</Typography>
			{metrics.metrics.map((metric) => (
				<div
					key={metric.metric.id}
					css={css`
						margin-bottom: 1rem;
						border: 1px solid black;
						border-radius: 4px;
						padding: 1rem;
					`}
				>
					<span
						css={css`
							display: flex;
							justify-content: space-between;
						`}
					>
						<Typography
							css={css`
								margin-bottom: 2px;
							`}
						>
							{metric.metric.name}
						</Typography>
						<Typography>
							{metric.metric.aggregationType}: {metric.data.totalAgg}
						</Typography>
					</span>
					<AreaChart width={1000} height={250} data={metric.data.series}>
						<Tooltip content={CustomTooltipContent as any} />
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='0' tickFormatter={tickFormatter} />
						<YAxis dataKey='1' />
						<Area type='monotone' dataKey='1' stroke='#8884d8' fill='#8884d8' />
					</AreaChart>
				</div>
			))}
		</Container>
	);
}

const CustomTooltipContent = ({
	payload,
	label,
}: {
	payload: any[];
	label: number;
}) => {
	const date = new Date(label * 1000);
	const formattedDate = moment(date).format('DD MMM');
	const value = payload[0]?.value;
	return (
		<div
			css={css`
				background-color: white;
			`}
		>
			<span>Date: {formattedDate}</span>
			<br />
			<span>Value: {value}</span>
		</div>
	);
};

export default observer(Metrics);
