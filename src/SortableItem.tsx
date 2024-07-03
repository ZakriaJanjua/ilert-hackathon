import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export const SortableItem = ({
	id,
	children,
	handleDelete,
}: {
	id: string;
	children: React.ReactNode;
	handleDelete: (id: string) => void;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const adjustedTransform = isDragging
		? {
				...transform,
				scaleY: 1,
		  }
		: transform;

	const style = {
		transform: CSS.Transform.toString(adjustedTransform as any),
		transition,
		border: '1px dashed black',
		position: 'relative',
	};

	return (
		<div ref={setNodeRef} style={style as any} {...attributes}>
			<IconButton
				onClick={() => {
					handleDelete(id);
				}}
				sx={{ position: 'absolute', top: 8, right: 8 }}
			>
				<FontAwesomeIcon icon={faTrashCan} />
			</IconButton>
			<div {...listeners}>{children}</div>
		</div>
	);
};
