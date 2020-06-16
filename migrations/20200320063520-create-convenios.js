module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('convenios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },      
      nombre: {
        type: Sequelize.STRING
      },
      inicio: {
        type: Sequelize.STRING
      },
      fin: {
        type: Sequelize.STRING
      },
      num_acuerdo: {
        type: Sequelize.STRING
      },
      num_expediente: {
        type: Sequelize.STRING
      },
      tipo_convenio: {
        type: Sequelize.STRING
      },
      id_personales: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('convenios');
  }
};