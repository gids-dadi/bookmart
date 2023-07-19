const allRoles = {
  // User Roles
  admin: ["createBooks", "updateBooks", "deleteBooks"],
  customer: ["getBooks", "addToCart", "deleteBooks"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};

