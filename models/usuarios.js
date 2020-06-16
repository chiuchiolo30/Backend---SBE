module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define('usuarios', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type:   DataTypes.INTEGER
    },
    nombre:   DataTypes.STRING,
    email:    DataTypes.STRING,
    password: DataTypes.STRING,
    img:      DataTypes.STRING,
    google:   {
               type: DataTypes.BOOLEAN,
               defaultValue(){ return false;}
              },
    role:     DataTypes.STRING
  }, {timestamps: false});
  Usuarios.associate = function(models) {
    
  };
  return Usuarios;
};