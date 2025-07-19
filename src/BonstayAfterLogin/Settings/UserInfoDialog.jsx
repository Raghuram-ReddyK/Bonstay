import React from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper
} from '@mui/material';
import Draggable from 'react-draggable';
import * as XLSX from 'xlsx';

const DraggableDialog = (props) => {
    const { onClose, ...other } = props;
    return (
        <Draggable handle="#draggable-dialog-title">
            <Paper {...other} />
        </Draggable>
    );
};

const UserInfoDialog = ({
    open,
    onClose,
    userInfo,
    dialogSize,
    onMouseDown
}) => {
    const handleExportExcel = () => {
        if (userInfo) {
            const ws = XLSX.utils.json_to_sheet([userInfo]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'User Info');
            XLSX.writeFile(wb, 'user_info.xlsx');
        }
    };

    const handlePrint = () => {
        if (userInfo) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>User Account Info</title></head><body>');
            printWindow.document.write(`<h1>User Account Information</h1>`);
            printWindow.document.write(`<strong>User ID:</strong> ${userInfo.id.toUpperCase()}<br />`);
            printWindow.document.write(`<strong>User Name:</strong> ${userInfo.name.toUpperCase()}<br />`);
            printWindow.document.write(`<strong>Email:</strong> ${userInfo.email.toUpperCase()}<br />`);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperComponent={DraggableDialog}
            sx={{
                '& .MuiDialog-paper': {
                    width: dialogSize.width,
                    height: dialogSize.height,
                },
            }}
        >
            <DialogTitle id="draggable-dialog-title" sx={{ cursor: 'move', position: 'relative' }}>
                User Account Information
                <div
                    style={{
                        cursor: 'nwse-resize',
                        width: '20px',
                        height: '20px',
                        position: 'absolute',
                        right: '10px',
                        bottom: '10px',
                        backgroundColor: 'gray',
                    }}
                    onMouseDown={onMouseDown}
                />
            </DialogTitle>
            <DialogContent>
                {userInfo ? (
                    <Box>
                        <Typography><strong>User ID:</strong> {userInfo.id.toUpperCase()}</Typography>
                        <Typography><strong>User Name:</strong> {userInfo.name.toUpperCase()}</Typography>
                        <Typography><strong>Email:</strong> {userInfo.email.toUpperCase()}</Typography>
                        <Typography><strong>User Type:</strong> {userInfo.userType === 'admin' ? 'Administrator' : 'Normal User'}</Typography>

                        {userInfo.userType === 'admin' && userInfo.department && (
                            <Typography><strong>Department:</strong> {userInfo.department.toUpperCase()}</Typography>
                        )}

                        {userInfo.userType === 'user' && (
                            <>
                                {userInfo.dateOfBirth && (
                                    <Typography><strong>Date of Birth:</strong> {userInfo.dateOfBirth}</Typography>
                                )}
                                {userInfo.gender && (
                                    <Typography><strong>Gender:</strong> {userInfo.gender.toUpperCase()}</Typography>
                                )}
                                {userInfo.occupation && (
                                    <Typography><strong>Occupation:</strong> {userInfo.occupation.toUpperCase()}</Typography>
                                )}
                            </>
                        )}
                    </Box>
                ) : (
                    <Typography>Loading...</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleExportExcel}>Export as Excel</Button>
                <Button onClick={handlePrint}>Print</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserInfoDialog;
