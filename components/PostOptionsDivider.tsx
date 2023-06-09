import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


export default function PostOptionsDivider(
    { onDelete, onEdit }:{ onDelete: () => void, onEdit: () => void }
) {
    return (
        <List className='drop-down' component="nav" aria-label="mailbox folders">
            <ListItem onClick={onDelete} button >
                <ListItemText className='text-center' primary="Delete" />
            </ListItem>
            <Divider />
            <ListItem onClick={onEdit} button >
                <ListItemText className='text-center' primary="Edit" />
            </ListItem>
        </List>
    );
}