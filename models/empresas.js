module.exports = (sequelize, DataTypes) => {
  const Empresas = sequelize.define('empresas', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    direccion: DataTypes.STRING,
    cuit: DataTypes.STRING,
    img: DataTypes.STRING,
    cod_empresa: DataTypes.INTEGER
  }, {timestamps: false});
  Empresas.associate = function(models) {
    // associations can be defined here    
    // 1:N 
    Empresas.hasMany(models.Convenios, {
      through: 'convenios',
      foreignKey: 'idempresa'
    });
    // 1:N 
    Empresas.hasMany(models.Personales, {
      through: 'personales',
      foreignKey: 'idempresa'
    });
  };
  return Empresas;
};