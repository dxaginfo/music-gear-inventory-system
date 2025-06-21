import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Tooltip, 
  IconButton,
  CardActions,
  Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode as QrCodeIcon,
  Build as BuildIcon,
  Event as EventIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Equipment } from '../types/equipment';
import { formatCurrency } from '../utils/formatters';

interface EquipmentCardProps {
  equipment: Equipment;
  onDelete: (id: string) => void;
  onMaintenance: (id: string) => void;
  onAddToEvent: (id: string) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ 
  equipment, 
  onDelete,
  onMaintenance,
  onAddToEvent
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/equipment/${equipment.id}/edit`);
  };

  const handleView = () => {
    navigate(`/equipment/${equipment.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(equipment.id);
  };

  const handleMaintenance = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMaintenance(equipment.id);
  };

  const handleAddToEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToEvent(equipment.id);
  };

  const handleGenerateQR = (e: React.MouseEvent) => {
    e.stopPropagation();
    // QR code generation logic
    console.log(`Generate QR for ${equipment.id}`);
  };

  const getConditionColor = () => {
    switch (equipment.condition) {
      case 'EXCELLENT':
        return 'success';
      case 'GOOD':
        return 'info';
      case 'FAIR':
        return 'warning';
      case 'POOR':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMaintenanceStatus = () => {
    if (!equipment.maintenanceSchedule || !equipment.maintenanceSchedule.nextDue) {
      return { label: 'No Schedule', color: 'default' };
    }

    const nextDue = new Date(equipment.maintenanceSchedule.nextDue);
    const today = new Date();
    const diffDays = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Overdue', color: 'error' };
    } else if (diffDays < 7) {
      return { label: 'Due Soon', color: 'warning' };
    } else {
      return { label: 'Scheduled', color: 'success' };
    }
  };

  const maintenanceStatus = getMaintenanceStatus();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6
        }
      }}
      onClick={handleView}
    >
      <CardMedia
        component="img"
        height="140"
        image={equipment.photos && equipment.photos.length > 0 
          ? equipment.photos[0].photoUrl 
          : '/assets/placeholder-equipment.jpg'}
        alt={equipment.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {equipment.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {equipment.brand} {equipment.model}
          </Typography>
          <Chip 
            label={equipment.condition} 
            size="small" 
            color={getConditionColor() as any}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Value:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {formatCurrency(equipment.currentValue || 0)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Location:
          </Typography>
          <Typography variant="body2">
            {equipment.location || 'Unknown'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Maintenance:
          </Typography>
          <Chip 
            label={maintenanceStatus.label} 
            size="small" 
            color={maintenanceStatus.color as any}
          />
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box>
            <Tooltip title="Generate QR Code">
              <IconButton size="small" onClick={handleGenerateQR}>
                <QrCodeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Schedule Maintenance">
              <IconButton size="small" onClick={handleMaintenance}>
                <BuildIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add to Event">
              <IconButton size="small" onClick={handleAddToEvent}>
                <EventIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EquipmentCard;