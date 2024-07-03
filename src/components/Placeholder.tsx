import { Button, Container } from '@mui/material';

function Placeholder({ onAdd }: { onAdd: () => void }) {
	return (
		<Container
			sx={{
				marginTop: '1rem',
				borderRadius: '3px',
				padding: '5rem',
				height: '20rem',
				border: '1px dashed black',
				textAlign: 'center',
			}}
		>
			<Button variant='outlined' onClick={onAdd}>
				Add Component
			</Button>
		</Container>
	);
}

export default Placeholder;
