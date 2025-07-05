import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const NotificationsDialog = ({ notifications, dialogOpen, toggleDialog, markAsRead, removeNotification, removeAllNotifications }) => {
  return (
    <Dialog open={dialogOpen} onClose={toggleDialog}>
      <DialogTitle>Notifications</DialogTitle>
      <DialogContent>
        {notifications.length === 0 ? (
          <Typography>No new notifications</Typography>
        ) : (
          notifications.map((notif) => (
            <Box key={notif.id} sx={{ marginBottom: 2, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ flexGrow: 1 }}>{notif.message}</Typography>
              {/* Mark as Read Icon */}
              {!notif.read && (
                <IconButton onClick={() => markAsRead(notif.id)} color="primary" size="small">
                  <CheckCircleIcon />
                </IconButton>
              )}
              {/* Remove Icon */}
              <IconButton onClick={() => removeNotification(notif.id)} color="secondary" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions>
        {/* "Remove All" button */}
        {notifications.length > 0 && (
          <Button 
            onClick={removeAllNotifications} 
            color="secondary" 
            startIcon={<DeleteForeverIcon />}
            size="small"
          >
            Remove All
          </Button>
        )}
        <Button onClick={toggleDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationsDialog;
