module.exports = (sequelize, DataTypes) => {
  const Acuerdos = sequelize.define('acuerdos', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    area_trabajo: DataTypes.STRING,
    asig_mensual: DataTypes.STRING,
    obra_social: DataTypes.STRING,
    art: DataTypes.STRING,
    num_expediente: DataTypes.STRING,
    cod_acuerdo: DataTypes.STRING,
    inicio: DataTypes.STRING,
    fin: DataTypes.STRING,
    caracteristicas: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    id_personales: DataTypes.INTEGER,
    }, 
    {timestamps: false});
  Acuerdos.associate = function(models) {
    // associations can be defined here 1:1
    Acuerdos.hasOne(models.Alumnos, {
      through: 'alumnos',
      foreignKey: 'id_acuerdo'
    });
  };
  return Acuerdos;
};