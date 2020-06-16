module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('acuerdos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },     
      tipo_acuerdo: {
        type: Sequelize.STRING
      },
      area_trabajo: {
        type: Sequelize.STRING
      },
      asig_mensual: {
        type: Sequelize.STRING
      },
      obra_social: {
        type: Sequelize.STRING
      },
      art: {
        type: Sequelize.STRING
      },
      num_expediente: {
        type: Sequelize.STRING
      },
      cod_acuerdo: {
        type: Sequelize.STRING
      },
      inicio: {
        type: Sequelize.STRING
      },
      fin: {
        type: Sequelize.STRING
      },
      caracteristicas: {
        type: Sequelize.STRING
      },
      observaciones: {
        type: Sequelize.STRING
      },
      id_personales: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('acuerdos');
  }
};