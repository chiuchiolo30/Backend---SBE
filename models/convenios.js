module.exports = (sequelize, DataTypes) => {
  const Convenios = sequelize.define('convenios', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    inicio: DataTypes.STRING,
    fin: DataTypes.STRING,
    num_acuerdo: DataTypes.STRING,
    num_expediente: DataTypes.STRING,
    tipo_convenio: DataTypes.STRING,
    id_personales: DataTypes.INTEGER
  }, {timestamps: false});
  Convenios.associate = function(models) {
    // associations can be defined here
  };
  return Convenios;
};