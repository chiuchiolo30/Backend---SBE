
module.exports = (sequelize, DataTypes) => {
  const alumnos = sequelize.define('alumnos', {
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
      carrera: DataTypes.STRING,
      libreta: DataTypes.STRING,
      img: DataTypes.STRING,
      id_acuerdo: DataTypes.INTEGER,
      },
      {timestamps: false});
      alumnos.associate = function(models) {
       // associations can be defined here 1:1
    Acuerdos.hasOne(models.Alumnos, {
      through: 'acuerdos',
      foreignKey: 'id'
    });
      };
  return alumnos;
};

