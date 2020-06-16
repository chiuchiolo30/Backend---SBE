module.exports = (sequelize, DataTypes) => {
  const Personales = sequelize.define('personales', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    dni: DataTypes.INTEGER,
    direccion: DataTypes.STRING,
    email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    cargo: DataTypes.STRING,
    img: DataTypes.STRING,
    idempresa: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
    }, 
    {timestamps: false});
    Personales.associate = function(models) {
    // associations can be defined here 1:N
    Personales.hasMany(models.Acuerdos, {
      through: 'acuerdos',
      foreignKey: 'id_personales'
    });
    Personales.hasMany(models.Convenios, {
      through: 'convenios',
      foreignKey: 'id_personales'
    });
  };
  return Personales;
};