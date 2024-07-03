/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { Button, ButtonGroup, Stack, Typography } from '@mui/material';
import Header from './components/Header';
import { team } from './store/Team';
import { observer } from 'mobx-react';
import { css } from '@emotion/react';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Alerts from './components/Alerts';
import RecentLogEntries from './components/RecentLogEntries';
import Services from './components/Services';
import Incidents from './components/Incidents';
import Metrics from './components/Metrics';
import {
	DndContext,
	closestCorners,
	useSensor,
	useSensors,
	PointerSensor,
	DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import Placeholder from './components/Placeholder';
import { dashboard } from './store/Dashboard';
import AlertDialog from './components/Dialog';

function App() {
	const components = [
		{ id: 'alerts', component: <Alerts /> },
		{ id: 'recentLogEntries', component: <RecentLogEntries /> },
		{ id: 'services', component: <Services /> },
		{ id: 'incidents', component: <Incidents /> },
		{ id: 'metrics', component: <Metrics /> },
		{
			id: 'placeholder',
			component: <Placeholder onAdd={() => setEditing(true)} />,
		},
	];

	const [editing, setEditing] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [items, setItems] = useState(components);

	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (id: string | null) => {
		if (id === null) {
			setAnchorEl(null);
		} else {
			handleAdd(id);
			setAnchorEl(null);
		}
	};

	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};

	const handleDelete = (id: string) => {
		setItems((items) =>
			items.map((item) =>
				item.id === id
					? {
							id: 'placeholder',
							component: <Placeholder onAdd={() => setEditing(true)} />,
					  }
					: item
			)
		);
	};

	const handleDialogOpen = () => {
		setOpenDialog(true);
	};

	const handleDialogClose = () => {
		setOpenDialog(false);
	};

	const handleAdd = (id: string) => {
		let itemPresent = false;
		items.forEach((itm) => {
			if (itm.id === id) {
				itemPresent = true;
				handleDialogOpen();
			}
		});
		if (!itemPresent) {
			const addedComp = components.find((c) => c.id === id);
			setItems((items) => {
				const updatedItems = items.slice(); // Create a copy to avoid mutation
				updatedItems[items.findIndex((item) => item.id === 'placeholder')] =
					addedComp as any;
				return updatedItems;
			});
		}
	};

	useEffect(() => {
		getLayout();
	}, [team.selectedTeam.id]);

	async function getLayout() {
		await dashboard.getLayout();
		let conditionMet = false;
		if (dashboard.layout.components?.length) {
			dashboard.layout.components.forEach((comp: any) => {
				if (comp.team === team.selectedTeam.id) {
					conditionMet = true;
					const matchedComponents = comp.sequence.reduce(
						(acc: any, item: any) => {
							const matchingComponent = components.find(
								(c) => c.id === item.id
							);
							return matchingComponent ? [...acc, matchingComponent] : acc;
						},
						[]
					);
					setItems(matchedComponents);
				}
			});
			if (!conditionMet) {
				setItems(components);
			}
			team.teams.forEach((t) => {
				if (t.id === dashboard.layout.currentTeam) {
					team.selectTeam(t);
				}
			});
		}
	}

	async function putLayout(body: any) {
		await dashboard.putLayout(body);
	}

	async function handleSave() {
		setEditing(false);
		let result;
		if (dashboard.layout.components?.length) {
			const newLayout = dashboard.layout.components.filter((c: any) => {
				return c.team !== team.selectedTeam.id;
			});
			newLayout.push({
				team: team.selectedTeam.id,
				sequence: items.map((item) => ({ id: item.id })),
			});
			result = {
				components: [...newLayout],
				currentTeam: team.selectedTeam.id,
			};
		} else {
			result = {
				components: [
					{
						team: team.selectedTeam.id,
						sequence: items.map((item) => ({ id: item.id })),
					},
				],
				currentTeam: team.selectedTeam.id,
			};
		}
		await putLayout(result);
	}

	return (
		<>
			<section>
				<Header />
			</section>
			<Container>
				<Stack direction='row' justifyContent='space-between' alignItems='end'>
					<Typography
						variant='h4'
						css={css`
							margin-top: 1rem;
						`}
					>
						Dashboard / {team.selectedTeam.name}
					</Typography>
					{!editing && (
						<Button variant='outlined' onClick={() => setEditing(true)}>
							Edit
						</Button>
					)}

					{editing && (
						<ButtonGroup variant='contained'>
							<Button onClick={handleSave}>Save</Button>
							<Button
								id='basic-button'
								aria-controls={open ? 'basic-menu' : undefined}
								aria-haspopup='true'
								aria-expanded={open ? 'true' : undefined}
								onClick={handleClick}
								variant='outlined'
								endIcon={<FontAwesomeIcon icon={faCaretDown} />}
							>
								Add
							</Button>
							<Menu
								id='basic-menu'
								anchorEl={anchorEl}
								open={open}
								onClose={() => handleClose(null)}
								MenuListProps={{
									'aria-labelledby': 'basic-button',
								}}
							>
								<MenuItem onClick={() => handleClose('alerts')}>
									Open Alerts
								</MenuItem>
								<MenuItem onClick={() => handleClose('recentLogEntries')}>
									Recent Alerts Activity
								</MenuItem>
								<MenuItem onClick={() => handleClose('services')}>
									Service Status
								</MenuItem>
								<MenuItem onClick={() => handleClose('incidents')}>
									Open Incidents
								</MenuItem>
								<MenuItem onClick={() => handleClose('metrics')}>
									Metrics
								</MenuItem>
							</Menu>
						</ButtonGroup>
					)}
				</Stack>
			</Container>
			<Divider
				css={css`
					margin-top: 1rem;
				`}
			/>
			<Container>
				{editing ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCorners}
						onDragEnd={handleDragEnd}
					>
						<SortableContext items={items}>
							{items.map((item) => (
								<SortableItem
									key={item.id}
									id={item.id}
									handleDelete={handleDelete}
								>
									{item.component}
								</SortableItem>
							))}
						</SortableContext>
					</DndContext>
				) : (
					<div>
						{items.map(({ id, component }) => (
							<div key={id}>{component}</div>
						))}
					</div>
				)}
				<AlertDialog
					open={openDialog}
					handleClickOpen={handleDialogOpen}
					handleClose={handleDialogClose}
				/>
			</Container>
		</>
	);
}

export default observer(App);
