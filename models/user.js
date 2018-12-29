module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        iduser: { type: DataTypes.INTEGER, primaryKey: true },
        username: DataTypes.STRING(45),
        password: DataTypes.STRING(45),
        name: DataTypes.STRING(45),
        isadmin: DataTypes.BOOLEAN
    });
};