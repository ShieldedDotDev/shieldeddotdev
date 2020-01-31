<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js"
			integrity="sha256-1fEPhSsRKlFKGfK3eO710tEweHh1fwokU5wFGDHO+vg=" crossorigin="anonymous"></script>
	<script src="main.js"></script>
</head>

<body class="dashboard--app">
	<?php require('_header.php') ?>
	<section>
		<article id="dashboard">
			<h3>Dashboard</h3>
		</article>
	</section>

	<script>
		document.addEventListener('DOMContentLoaded', function () {
			require(['dashboard'], function(d){
				d.Dashboard(
					document.getElementById("dashboard")
				);
			});
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>