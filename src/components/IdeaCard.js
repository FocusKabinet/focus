import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import empty from "../assets/empty-state-photo.png";

export default function IdeaCard(props) {
  const { title, description, img_url, subheader } = props;
  const [menu, menuToggle] = React.useState(null);

  const handleToggle = (e) => {
    menuToggle(Boolean(menu) ? false : e.currentTarget);
  };
  return (
    <Card className="card-idea">
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <>
            <IconButton
              aria-label="settings"
              className="header-settings"
              onClick={handleToggle}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={menu}
              id="simple-menu"
              keepMounted
              open={Boolean(menu)}
              onClose={handleToggle}
            >
              <MenuItem onClick={handleToggle}>Edit</MenuItem>
              <MenuItem onClick={handleToggle} className="menu-item-delete">
                Delete
              </MenuItem>
            </Menu>
          </>
        }
      />
      <CardMedia
        className="card-img"
        image={img_url}
        component="img"
        onError={(e) => (e.target.src = empty)}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions />
    </Card>
  );
}
